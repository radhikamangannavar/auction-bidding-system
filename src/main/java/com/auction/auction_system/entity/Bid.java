package com.auction.auction_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private double amount;

    private LocalDateTime timestamp;

    @ManyToOne
    private User user;

    @ManyToOne
    private Auction auction;
}