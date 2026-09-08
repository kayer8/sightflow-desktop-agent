// dev 启动入口 —— 确保 Windows 终端在拉起 electron-vite 之前处于 UTF-8 代码页
// 背景：electron-vite dev 会用 pipe 接管 Electron 主进程 stdout，在主进程里 chcp
// 改不到真实终端；必须在 npm 启动链最外层（本脚本）先把当前 cmd 的代码页切到 65001，
// 这样后续派生的 electron-vite / electron 子进程的 UTF-8 输出才能被终端正确渲染。

import { spawn } from 'node:child_process'

// Set the code page in the same shell that launches electron-vite. Changing it
// in the parent process is not reliable when npm/PowerShell creates another
// shell for the child process.
const mode = process.argv[2] || 'dev'
const command = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'electron-vite'
const args = process.platform === 'win32'
  ? ['/d', '/s', '/c', `chcp 65001>nul && electron-vite ${mode}`]
  : [mode]

const child = spawn(command, args, {
  stdio: 'inherit',
  shell: false,
  windowsHide: false
})

child.on('exit', (code) => process.exit(code ?? 0))
