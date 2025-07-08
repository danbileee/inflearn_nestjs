import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketMessageTypes } from './constants/message.const';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import {
  UseFilters,
  // UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/exception-filters/ws.exception-filter';
// import { SocketBearerTokenGuard } from 'src/auth/guards/token.guard';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseFilters(WsExceptionFilter)
// @UseGuards(SocketBearerTokenGuard)
@WebSocketGateway({
  namespace: 'chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('after gateway init', server);
  }

  async handleConnection(socket: Socket & { user: UserModel }) {
    console.log(`on connect called: ${socket.id}`);

    const rawToken = socket.handshake.headers.authorization;

    if (!rawToken) {
      socket.disconnect();
      throw new WsException('Token not found.');
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;
    } catch (e) {
      socket.disconnect();
      throw new WsException(`Token is not valid. Error: ${e.message}`);
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`on disconnect called: ${socket.id}`);
  }

  @SubscribeMessage(SocketMessageTypes.CreateChat)
  async createChat(
    @MessageBody() createChatDto: CreateChatDto,
    // @ConnectedSocket() socket: Socket & { user: UserModel },
  ) {
    const chat = await this.chatsService.createChat(createChatDto);

    return chat;
  }

  @SubscribeMessage(SocketMessageTypes.EnterChat)
  async enterChat(
    @MessageBody() enterChatDto: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UserModel },
  ) {
    const { chatIds } = enterChatDto;
    const filteredChatIds = chatIds.filter(async (chatId) => {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 채팅입니다. Chat ID: ${chatId}`,
        });
      }

      return exists;
    });

    socket.join(filteredChatIds.map((chatId) => chatId.toString()));
  }

  @SubscribeMessage(SocketMessageTypes.SendMessage)
  async sendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() socket: Socket & { user: UserModel },
  ) {
    const { chatId } = createMessageDto;
    const exists = await this.chatsService.checkIfChatExists(chatId);

    if (!exists) {
      throw new WsException({
        code: 100,
        message: `존재하지 않는 채팅입니다. Chat ID: ${chatId}`,
      });
    }

    const message = await this.messagesService.createMessage(
      createMessageDto,
      socket.user,
    );

    socket
      .to(message.chat.id.toString())
      .emit(SocketMessageTypes.ReceiveMessage, message.message);
    // this.server
    //   .in(body.chatId.toString())
    //   .emit(SocketMessageTypes.ReceiveMessage, body.message);
  }
}
