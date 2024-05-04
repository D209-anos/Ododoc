package com.ssafy.ododoc.directory.repository;

import com.ssafy.ododoc.directory.dto.response.DirectoryResponse;
import com.ssafy.ododoc.directory.entity.Directory;
import com.ssafy.ododoc.member.entity.Member;

public interface DirectoryClosureCustomRepository {

    void deleteClosure(Directory directory);
    DirectoryResponse getDirectory(Long rootId, Member member);
}
