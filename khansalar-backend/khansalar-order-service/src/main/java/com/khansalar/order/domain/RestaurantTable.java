package com.khansalar.order.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("restaurant_tables")
public class RestaurantTable {
    @Id
    private Long id;

    @Column("table_number")
    private String tableNumber;

    @Column("title")
    private String title;

    @Column("capacity")
    private Integer capacity;

    @Column("status")
    private String status; // EMPTY, OCCUPIED, RESERVED

    @Column("created_at")
    private Instant createdAt;
}
