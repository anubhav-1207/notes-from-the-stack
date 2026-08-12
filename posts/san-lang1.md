# San: Building a Programming Language on an Android Tablet

*Published: [August 12, 2026] | Reading time: x minutes | Tags: [programming-language, compiler, san, android, python]*

---

## TL;DR
- San is a simple dynamically and strongly typed programming language.
- I built most of it on an Android tablet, specifically Lenovo Tab K10 using a Debian+XFCE PRoot container.
- **Key features**: I/O, variables, loop, conditionals, functions, recursion, arrays, indexing, slicing, standard library.
- **Biggest challenges**: Arm architecture, tooling gaps, extremely slow performance, 4GB memory, time constraints.
- Repo: [!https://github.com/anubhav-1207/san]
---

## Why I Built San
Initially, San started as just a simple school project, which I primarily chose because everyone else was stuck on CRUD apps which seemed too repetive and boring. I wanted to be unique, so I chose a programming language which is easy for beginners, but does not feel to toy-ish and distant from the already established programming languages.

The biggest advantage of San is that beginners can start quickly, since it is not as overwhelming with features like other languages, but that does not mean it has less features.

My main goal behind making San was my deep interest in low-level computation and curiosity about how programming languages work. My initial interest in how programming languages are made and work started about 3 years ago, when I was still a novice. 

San is the best language for people who are looking to just get started into programming quickly and write meaningful code. It is not a programming languages that aims to beat other programming languages in terms of speed and performance, but it can beat every other programming language in terms of "beginner-friendliness".

- Any personal story? (hackathon, class project, late‑night coding on your tablet, etc.)

---

## My Setup - Coding San on Android

My setup mostly includes a 5 year-old low end android tablet with 4GB of ram

I run San inside a Debian Linux environment that lives on my Android tablet through a user-space compatibility layer called PRoot. It is not a full virtual machine and it does not need root access; instead, it makes Debian think it is running normally by redirecting filesystem paths and permissions. On top of that, I use Termux as the base terminal app and Termux X11 to open a graphical display. XFCE runs inside Debian as the desktop environment, so I get windows, panels, a file manager, and a proper Linux-like workspace. This setup lets me install and use standard Linux tools like compilers, build systems, Git, and editors while still coding on Android. The biggest advantage is portability: I can develop almost anywhere. The downside is that it is slower and less seamless than a real Linux laptop, especially for heavier builds and multitasking, and unavailability of many tools due to the ARM architecture.

- **Device**: Lenovo TB-X6C6X
- **OS**: Android 12, Debian
- **Editor**: Code-OSS

Thanks to the following tutorials that I got to knew something like this is possible.

### What Worked Surprisingly Well

The editor and everything ran surprisingly better than I and you can think, since it was a highly optimised linux setup. I could write and edit code with minimal, near zero latency and run code just enough to not work.

### What Felt Painful

While I said everything ran surprisingly better, I did not mean it was the best. The terminals took about 5-7 seconds to load, Code-OSS itself took about 15-20 seconds to just open up, let alone showing all files. Most of the times my keyboard won't connect to the tablet because of an issue in the charging port. It would only connect at a very specific angle, which somehow was unknown and different everytime. The windows were not as fast, and some much needed keyboard shortcuts do not work because they are intercepted by the android system before it reaches the linux system.

> Well, I can't lie, but overtime, I got accustomed to the 20 FPS view, and slow start-up times and frequent freezes to the point where it seemed pretty normal, so it stopped bothering me after quite some time.

---

## Design Goals & Influences

- **Goal 1:** Make a complete programming language that is virtually capable to do anything
- **Goal 2:** Make and design the syntax closer to major programming languages.
- **Goal 3:** Keep the language simple enough for beginners to not get overwhelmed.
- **Goal 4:** Design the syntax such that users get accustomed multiple languages at the same time.
### Influences:

- C, Rust, Python, C++
- Explicity from Rust, Immutability from Rust, Syntax from C and Rust, Simplicity from Python

---