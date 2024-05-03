import * as vscode from "vscode";
import axios from "axios";

const redirectUri = encodeURIComponent("https://k10d209.p.ssafy.io/api");

export const oAuthLogin = async (provider: string): Promise<void> => {
  const socialLoginUrl: { [key: string]: string } = {
    kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=${redirectUri}`,
    naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=DRnVNgGzq_x_6Q4apfhJ&redirect_uri=${redirectUri}`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com&redirect_uri=${redirectUri}&scope=profile&response_type=code`,
  };

  const authUrl = socialLoginUrl[provider];
  await vscode.env.openExternal(vscode.Uri.parse(authUrl));
};

export const getAccessToken = async (
  code: string,
  provider: string
): Promise<void> => {
  const tokenUrl = `https://k10d209.p.ssafy.io/api/oauth2/authorization/${provider}`;
  try {
    const response = await axios.post(tokenUrl, {
      code: code,
      redirectUri: redirectUri,
    });
    if (response.data) {
      console.log("Access Token:", response.data.accessToken);
      console.log("Refresh Token:", response.data.refreshToken);
      // secreatStorage에 저장 로직 추가
    }
  } catch (error) {
    console.error("access 토큰 발급에 실패했는디요??:", error);
  }
};
