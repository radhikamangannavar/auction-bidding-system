package com.auction.auction_system.repository;

import com.auction.auction_system.entity.Bid;
import com.auction.auction_system.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    List<Bid> findByAuction(Auction auction);
}