import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    originalTitle: string;

    @Column()
    posterUrl: string;

    @Column({ type: 'float', nullable: true })
    voteAverage?: number;

    @Column({ nullable: true })
    releaseDate?: string;

    @Column({ nullable: true })
    userIp?: string;
} 