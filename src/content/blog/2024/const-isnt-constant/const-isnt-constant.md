---
title: "Const isn't constant"
date: 2024-08-07
slug: 'const-isnt-constant'
type: Post
include_in_reading_list: true
status: Published
link: 'https://youtu.be/8117-JmjgOA?t=5065'
---

In every Javascript app I've worked on, the linter has enforced preference towards `let` over `const`. And yet I've always wondered why code like this is valid Javascript:

```tsx
const user = {
  id: 1234;
}

user.id = 4567;
```

This lightning talk by Ryan Florence finally made it click–`const` doesn't create true immutability! It just makes it _feel_ like the code is immutable.
