flicks = {
  "C:\\ Drive": {
    "cmd":"explorer.exe C:\\"
  },
  "Lock Workstation": {
  	"cmd":"Rundll32.exe User32.dll,LockWorkStation"
  },
  "Show Desktop": {
    "cmd":"powershell -command \"& { $x = New-Object -ComObject Shell.Application; $x.minimizeall()  }\""
  },
  "Open Explorer": {
    "cmd":"explorer.exe"
  }
}