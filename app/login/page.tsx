"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import styles from "./index.module.scss";
import { showToast } from "../components/ui-lib";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      // 处理响应
      if (response.ok) {
        // 登录成功
        const data = await response.json();
        // 存储 JWT 到 localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginName", data.name);

        // 跳转到首页
        router.push("/");
      } else {
        // 登录失败
        showToast("登录失败，可能到期");
      }
    } catch (error) {
      // 处理错误
      showToast("登录错误，可能到期");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">用户名:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">密码:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  );
}
