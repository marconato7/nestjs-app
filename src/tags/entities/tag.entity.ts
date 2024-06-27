import { Column, Entity, PrimaryColumn } from "typeorm";
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class Tag
{
    @PrimaryColumn()
    id: string = uuidv7();

    @Column({ unique: true, nullable: false })    
    name: string;

    private constructor(name: string)
    {
        this.name = name;
    }

    public static create(name: string)
    {
        return new this(name);
    }
}
