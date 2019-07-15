package com.qute.data.quote;

import com.qute.data.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Table(name = "api_quote")
@Entity
@EqualsAndHashCode(of = {"originalServerKey"})
public class ApiQuote extends QuoteCoreData {

    private String originalServerKey;

    @JoinTable(name = "api_quote_pluses",
            joinColumns = { @JoinColumn(name = "api_quote_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<User> quotePluses = new HashSet<>();

    @JoinTable(name = "api_quote_medium",
            joinColumns = { @JoinColumn(name = "api_quote_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<User> quoteMedium = new HashSet<>();

    @JoinTable(name = "api_quote_minuses",
            joinColumns = { @JoinColumn(name = "api_quote_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<User> quoteMinuses = new HashSet<>();
}
