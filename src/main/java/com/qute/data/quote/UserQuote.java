package com.qute.data.quote;

import com.qute.data.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Table(name = "user_quote")
@Entity
@EqualsAndHashCode(of = {"id"})
public class UserQuote extends QuoteCoreData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JoinTable(name = "user_quote_pluses",
            joinColumns = { @JoinColumn(name = "user_quote_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<User> quotePluses = new HashSet<>();

    @JoinTable(name = "user_quote_medium",
            joinColumns = { @JoinColumn(name = "user_quote_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<User> quoteMedium = new HashSet<>();

    @JoinTable(name = "user_quote_minuses",
            joinColumns = { @JoinColumn(name = "user_quote_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") }
    )
    private Set<User> quoteMinuses = new HashSet<>();
}
