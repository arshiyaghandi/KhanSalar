package com.khansalar.inventory.repository;

import com.khansalar.inventory.domain.Recipe;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface RecipeRepository extends ReactiveCrudRepository<Recipe, Long> {
    Flux<Recipe> findByMenuItemId(Long menuItemId);
}
