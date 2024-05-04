package com.ssafy.ododoc.directory.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDirectoryClosure is a Querydsl query type for DirectoryClosure
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDirectoryClosure extends EntityPathBase<DirectoryClosure> {

    private static final long serialVersionUID = 359018319L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDirectoryClosure directoryClosure = new QDirectoryClosure("directoryClosure");

    public final QDirectory ancestor;

    public final NumberPath<Integer> depth = createNumber("depth", Integer.class);

    public final QDirectory descendant;

    public QDirectoryClosure(String variable) {
        this(DirectoryClosure.class, forVariable(variable), INITS);
    }

    public QDirectoryClosure(Path<? extends DirectoryClosure> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDirectoryClosure(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDirectoryClosure(PathMetadata metadata, PathInits inits) {
        this(DirectoryClosure.class, metadata, inits);
    }

    public QDirectoryClosure(Class<? extends DirectoryClosure> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.ancestor = inits.isInitialized("ancestor") ? new QDirectory(forProperty("ancestor"), inits.get("ancestor")) : null;
        this.descendant = inits.isInitialized("descendant") ? new QDirectory(forProperty("descendant"), inits.get("descendant")) : null;
    }

}

