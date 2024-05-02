package com.ssafy.ododoc.member.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -1750902918L;

    public static final QMember member = new QMember("member1");

    public final com.ssafy.ododoc.common.util.QBaseTime _super = new com.ssafy.ododoc.common.util.QBaseTime(this);

    public final NumberPath<Long> buildCount = createNumber("buildCount", Long.class);

    public final StringPath code = createString("code");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdTime = _super.createdTime;

    public final NumberPath<Long> errorCount = createNumber("errorCount", Long.class);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final StringPath nickname = createString("nickname");

    public final EnumPath<com.ssafy.ododoc.member.type.OAuthProvider> provider = createEnum("provider", com.ssafy.ododoc.member.type.OAuthProvider.class);

    public final SetPath<com.ssafy.ododoc.member.type.Role, EnumPath<com.ssafy.ododoc.member.type.Role>> roles = this.<com.ssafy.ododoc.member.type.Role, EnumPath<com.ssafy.ododoc.member.type.Role>>createSet("roles", com.ssafy.ododoc.member.type.Role.class, EnumPath.class, PathInits.DIRECT2);

    public final NumberPath<Long> searchCount = createNumber("searchCount", Long.class);

    public final StringPath title = createString("title");

    public final NumberPath<Long> visitCount = createNumber("visitCount", Long.class);

    public QMember(String variable) {
        super(Member.class, forVariable(variable));
    }

    public QMember(Path<? extends Member> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMember(PathMetadata metadata) {
        super(Member.class, metadata);
    }

}

