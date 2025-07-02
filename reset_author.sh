#!/bin/bash

echo "留空将跳过对应信息的替换。"

read -p "请输入要替换的旧邮箱（如不替换，请留空）: " old_email
read -p "请输入新的邮箱: " new_email

read -p "请输入要替换的旧用户名（如不替换，请留空）: " old_name
read -p "请输入新的用户名: " new_name

args=(--force)

if [[ -n "$old_email" && -n "$new_email" ]]; then
  args+=(
    --email-callback "
email_str = email.decode('utf-8')
if email_str == '$old_email':
    return b'$new_email'
return email
"
  )
fi

if [[ -n "$old_name" && -n "$new_name" ]]; then
  args+=(
    --name-callback "
name_str = name.decode('utf-8')
if name_str == '$old_name':
    return '$new_name'.encode('utf-8')
return name
"
  )
fi

if [[ ${#args[@]} -eq 1 ]]; then
  echo "未提供任何替换信息，已取消操作。"
  exit 1
fi

git filter-repo "${args[@]}"
