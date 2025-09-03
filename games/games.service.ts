import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateGameDto, GameState } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  private readonly logger = new Logger('GamesService');

  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const { name, maxPlayers, playerName, state } = createGameDto;

    try {
      const newGame = await this.gameModel.create({
        name,
        maxPlayers,
        players: [playerName],
        state: state || 'waiting',
        score: null,
      });

      return newGame;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const game = await this.gameModel.findOne({ where: { id } });

    if (!game) {
      throw new BadRequestException(`Game with id: ${id} not found`);
    }

    return game;
  }

  async joinGame(id: number, updateGameDto: UpdateGameDto) {
  const { playerName } = updateGameDto;

  if (!playerName) {
    throw new BadRequestException('Player name is required to join the game.');
  }

  const game = await this.findOne(id);

  if (game.players.includes(playerName)) {
    throw new BadGatewayException('The player has already joined!');
  }

  const newPlayers = [...game.players, playerName];

  if (newPlayers.length > game.maxPlayers) {
    throw new BadRequestException('The game is full');
  }

  try {
    await game.update({ players: newPlayers });
    return { message: 'Joined successfully!', players: newPlayers };
  } catch (error) {
    this.handleDBException(error);
  }
}


  async startGame(id: number) {
    const game = await this.findOne(id);
    try {
      await game.update({ state: GameState.IN_PROGRESS });
      return { message: 'The game has been started' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

   async endGame(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    try {
      await game.update({
         score: updateGameDto.score,
         state: GameState.FINISHED,
      });
      return { message: 'Game finished' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Something went very wrong!');
  }
}