package com.ssafy.ododoc.member.entity;

import com.ssafy.ododoc.common.util.BaseTime;
import com.ssafy.ododoc.member.type.OAuthProvider;
import com.ssafy.ododoc.member.type.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Member extends BaseTime implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 200, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(length = 6, nullable = false)
    private OAuthProvider provider;

    @Column(length = 10)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_roles", joinColumns = @JoinColumn(name = "member_id"),
            foreignKey = @ForeignKey(name = "FK_member_roles_member",
            foreignKeyDefinition = "FOREIGN KEY (member_id) REFERENCES member (id) ON DELETE CASCADE"))
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<Role> roles = Set.of(Role.USER);

    @Column(length = 100, nullable = false)
    private String nickname;

    @Column(length = 200, nullable = false)
    private String title;

    @Column
    private Long buildCount;

    @Column
    private Long errorCount;

    @Column
    private Long visitCount;

    @Column
    private Long searchCount;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return nickname;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
