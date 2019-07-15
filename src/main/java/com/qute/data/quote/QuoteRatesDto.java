package com.qute.data.quote;

import lombok.Getter;

@Getter
public class QuoteRatesDto {

    private Long quoteId;
    private int plusesCount;
    private int mediumCount;
    private int minusesCount;

    public QuoteRatesDto(int plusesCount, int mediumCount, int minusesCount, Long quoteId) {
        this.plusesCount = plusesCount;
        this.mediumCount = mediumCount;
        this.minusesCount = minusesCount;
        this.quoteId = quoteId;
    }
}
