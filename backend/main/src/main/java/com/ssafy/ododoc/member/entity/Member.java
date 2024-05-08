package com.ssafy.ododoc.member.entity;

import com.ssafy.ododoc.common.util.BaseTime;
import com.ssafy.ododoc.member.type.OAuthProvider;
import com.ssafy.ododoc.member.type.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@DynamicInsert
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

    @Column(columnDefinition = "bigint default 0")
    private Long buildCount;

    @Column(columnDefinition = "bigint default 0")
    private Long errorCount;

    @Column(columnDefinition = "bigint default 0")
    private Long visitCount;

    @Column(columnDefinition = "bigint default 0")
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

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;
        if(obj == null) return false;

        try {
            Member member = (Member) obj;
            return Objects.equals(this.id, member.getId());
        } catch (ClassCastException e) {
            return false;
        }
    }
}
