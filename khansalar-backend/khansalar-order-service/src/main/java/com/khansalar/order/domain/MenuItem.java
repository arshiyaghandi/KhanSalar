package com.khansalar.order.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("menu_items")
public class MenuItem {
    @Id
    private Long id;

    @Column("name")
    private String name;

    @Column("category")
    private String category;

    @Column("price")
    private BigDecimal price;

    @Column("description")
    private String description;

    @Column("is_available")
    private Boolean isAvailable;

    @Column("created_at")
    private Instant createdAt;
}
