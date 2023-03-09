import React, { useState } from "react";

type LoginSuccessMessage = "SUCCESS";
type LoginFailMessage = "FAIL";

interface LoginResponse {
  message: LoginSuccessMessage | LoginFailMessage;
  token: string;
}

interface UserInfo {
  name: string;
}

interface User {
  username: string;
  password: string;
  userInfo: UserInfo;
}

//user의 정보를 배열로 저장
const users: User[] = [
  {
    username: "blue",
    password: "1234",
    userInfo: { name: "blueStragglr" },
  },
  {
    username: "white",
    password: "1234",
    userInfo: { name: "whiteDwarf" },
  },
  {
    username: "red",
    password: "1234",
    userInfo: { name: "redGiant" },
  },
];

//임의로 생성한 토큰
const _secret: string = "1234qwer!@#$";

const login = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  // 토큰을 발급할지(유저네임이 존재하고, 그 유저가 가진 패스워드가 입력한 패스워드와 일치하는지) 여부를 확인하는 불리언 반환.
  const user: User | undefined = users.find((user: User) => {
    return user.username === username && user.password === password;
  });
  return user
    ? {
        message: "SUCCESS",
        token: JSON.stringify({ user: user.userInfo, secret: _secret }),
      }
    : null;
};

const getUserInfo = async (token: string): Promise<UserInfo | null> => {
  const parsedToken = JSON.parse(token);
  //이 코드의 의도는 뭘까?
  if (!parsedToken?.secret || parsedToken.secret !== _secret) return null;

  const loggedUser: User | undefined = users.find((user: User) => {
    if (user.userInfo.name === parsedToken.user.name) return user;
  });
  return loggedUser ? loggedUser.userInfo : null;
};

const LoginWithMockAPI = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "" });

  //DOM에 접근하여 유저정보를 담아 로그인 함수를 호출하는 함수.
  const loginSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    //login함수를 호출하여 값을 loginRes에 저장.
    const loginRes = await login(
      formData.get("username") as string,
      formData.get("password") as string
    );
    //로그인 정보가 없다면 함수실행을 종료.
    if (!loginRes) return;
    //토큰을 받아서 getUserInfo 실행
    const userInfo = await getUserInfo(loginRes.token);
    //userInfo가 없다면 함수실행을 종료.
    if (!userInfo) return;

    setUserInfo(userInfo);
  };

  return (
    <div>
      <h1>Login with Mock API</h1>
      <form onSubmit={loginSubmitHandler}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit" value="Submit">
          submit
        </button>
      </form>
      <div>
        <h2>User info</h2>
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default LoginWithMockAPI;
