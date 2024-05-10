import * as vscode from "vscode";

export const oAuthLogin = async (provider: string): Promise<void> => {
  const redirectUri = encodeURIComponent(
    `http://localhost:8080/api/oauth2/authorization/vsc/${provider}`
  );
  const socialLoginUrl: { [key: string]: string } = {
    kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=${redirectUri}`,
    naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=DRnVNgGzq_x_6Q4apfhJ&redirect_uri=${redirectUri}`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com&redirect_uri=${redirectUri}&scope=profile&response_type=code`,
  };

  const authUrl = socialLoginUrl[provider];
  await vscode.env.openExternal(vscode.Uri.parse(authUrl));
};
