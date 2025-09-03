
import { type } from "os";
import { ARRAY } from "sequelize";
import { Table, Model, DataType, AllowNull, Column } from "sequelize-typescript";
import { toDefaultValue } from "sequelize/lib/utils";


@Table

export class Game extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
    @Column({
       type: DataType.INTEGER,
        allowNull: false,

    })
    
    maxPlayers: number;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        defaultValue: []

    })

    players: string[];

    @Column({
        type: DataType.ENUM("waiting", "in_progress", "finished"),
        defaultValue: "waiting"

    })

    state: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true,

    })

    score: Record<string, number>;

}