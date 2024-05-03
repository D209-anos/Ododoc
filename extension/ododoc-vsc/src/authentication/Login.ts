import * as vscode from "vscode";

export async function oAuthLogin(provider: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const redirectUri = "https://k10d209.p.ssafy.io/api";
  const socialLoginUrl: { [key: string]: string } = {
    kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a23282fc18f2b445d559dfe93fa96e6b&redirect_uri=${encodeURIComponent(
      redirectUri
    )}/oauth2/authorization/kakao`,
    naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=DRnVNgGzq_x_6Q4apfhJ&redirect_uri=${encodeURIComponent(
      redirectUri
    )}/oauth2/authorization/naver`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
      redirectUri
    )}/oauth2/authorization/google&scope=profile&response_type=code`,
  };
  const authUrl = socialLoginUrl[provider];
  const data = await vscode.env.openExternal(vscode.Uri.parse(authUrl));
  console.log(data);
  try {
    console.log("Waiting for auth callback...");
    const uri = await listenForAuthCallback();
    const query = new URLSearchParams(uri.query);
    console.log(query);
    const accessToken = query.get("access_token");
    const refreshToken = query.get("refresh_token");
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Login Failed: ${error}`);
    throw error;
  }
}

async function listenForAuthCallback(): Promise<vscode.Uri> {
  return new Promise((resolve, reject) => {
    // URI 핸들러 등록 로직
    const uriHandler = (uri: vscode.Uri) => {
      resolve(uri);
    };
    vscode.window.registerUriHandler({ handleUri: uriHandler });
  });
}
