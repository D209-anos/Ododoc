package com.ssafy.ododocintellij.tracker.project;

import com.intellij.psi.PsiFile;

public class ProjectInfo implements Cloneable{

    private PsiFile psiFile;
    private String hash;

    public ProjectInfo(PsiFile psiFile, String hash) {
        this.psiFile = psiFile;
        this.hash = hash;
    }

    public PsiFile getPsiFile() {
        return psiFile;
    }

    public void setPsiFile(PsiFile psiFile) {
        this.psiFile = psiFile;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
