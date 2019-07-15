package com.qute.repo;

import com.qute.data.quote.ApiQuote;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ApiQuoteRepo extends CrudRepository<ApiQuote, Long> {

    @Query("from ApiQuote apiQ where apiQ.originalServerKey = :originalServerKey")
    ApiQuote findByOriginalKey(@Param("originalServerKey") String originalServerKey);
}
