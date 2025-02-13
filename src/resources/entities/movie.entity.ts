import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryColumn()
    id: number;

    @Column({ unique: true })
    originalTitle: string;

    @Column()
    posterUrl: string;

    @Column({ type: 'float', nullable: true })
    voteAverage?: number;

    @Column({ nullable: true })
    releaseDate?: string;
} 