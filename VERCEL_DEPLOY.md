# Vercel 部署指南 - Alpine Explorer

## 前置要求

- GitHub 账号（代码已推送到仓库）
- Vercel 账号（可用 GitHub 登录）
- Supabase 项目（已配置好数据库）

## 部署步骤

### 1. 导入项目到 Vercel

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **Add New...** → **Project**
3. 选择 **Import Git Repository**
4. 找到并选择你的 `alpine-explorer` 仓库
5. 点击 **Import**

### 2. 配置项目设置

在导入页面配置以下选项：

| 设置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Root Directory | `./` (默认) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 3. 配置环境变量

在 **Environment Variables** 部分添加以下变量：

```
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_key
GEMINI_API_KEY=你的gemini_api_key（可选）
```

> ⚠️ 注意：Vite 项目的环境变量必须以 `VITE_` 开头才能在客户端访问

### 4. 部署

点击 **Deploy** 按钮，等待构建完成。

## 部署后配置

### 更新 Supabase 允许的 URL

部署成功后，需要将 Vercel 域名添加到 Supabase 的允许列表：

1. 进入 Supabase 控制台 → **Authentication** → **URL Configuration**
2. 在 **Site URL** 中填入你的 Vercel 域名：
   ```
   https://你的项目名.vercel.app
   ```
3. 在 **Redirect URLs** 中添加：
   ```
   https://你的项目名.vercel.app/**
   ```

## 自定义域名（可选）

1. 在 Vercel 项目页面，点击 **Settings** → **Domains**
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录
4. 记得同步更新 Supabase 的 URL 配置

## 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `VITE_SUPABASE_URL` | ✅ | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名公钥 |
| `GEMINI_API_KEY` | ❌ | Google Gemini API 密钥（AI 功能） |

## 常见问题

### 构建失败：找不到环境变量

确保环境变量名称以 `VITE_` 开头，且在 Vercel 项目设置中正确配置。

### 登录后重定向失败

检查 Supabase 的 **Redirect URLs** 是否包含你的 Vercel 域名。

### API 请求被 CORS 阻止

Supabase 默认允许所有来源，如果遇到问题，检查 Supabase 项目的 API 设置。

## 自动部署

连接 GitHub 后，每次推送到 `main` 分支都会自动触发部署。

## 预览部署

每个 Pull Request 都会自动生成预览链接，方便测试更改。

---

## 快速命令参考

```bash
# 本地构建测试
npm run build

# 本地预览构建结果
npm run preview

# 安装 Vercel CLI（可选）
npm i -g vercel

# 使用 CLI 部署
vercel
```
