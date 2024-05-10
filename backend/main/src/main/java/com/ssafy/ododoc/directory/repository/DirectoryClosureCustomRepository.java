package com.ssafy.ododoc.directory.repository;

import com.ssafy.ododoc.directory.dto.response.DirectoryResponse;
import com.ssafy.ododoc.directory.entity.DirectoryClosure;
import com.ssafy.ododoc.member.entity.Member;

import java.util.List;

public interface DirectoryClosureCustomRepository {

    List<DirectoryClosure> deleteClosure(Long directoryId);
    List<DirectoryClosure> moveClosure(Long directoryId);
    DirectoryResponse getDirectory(Long rootId, Member member);
}
