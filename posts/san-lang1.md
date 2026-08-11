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

The biggest problem that my programming language 
- What are your goals? (learning compilers, experimenting with PL design, etc.)
- Who is San for?
- Any personal story? (hackathon, class project, late‑night coding on your tablet, etc.)

---

## My Setup: Coding San on Android

Be specific so others in similar situations can relate and learn.

- Device: [e.g. “Samsung Tab S6 / Xiaomi Pad 5 / …”]
- OS: [Android version]
- Editor: [VS Code on Android / Termux + vim / Acode / …]
- Toolchain:
  - For San’s implementation: [C / Nim / Python / …]
  - Compilers/interpreters: [GCC via Termux, Nim compiler, Python, etc.]
  - Any remote setup? [SSH to a Linux server, GitHub Codespaces, etc.]

### What Worked Surprisingly Well

- [e.g. “VS Code on Android + Git was smooth for editing and committing”]
- [“Termux gave me a decent Linux‑like environment”]
- [“Running small test programs was fast enough”]

### What Felt Painful

- [Small screen, multitasking, keyboard issues, etc.]
- [Lack of certain tools or package managers]
- [Slow builds, memory pressure, storage limits, etc.]

---

## Design Goals & Influences

- **Goal 1:** [e.g. “Stay close to C mentally, but simpler syntax”]
- **Goal 2:** [e.g. “Make compiler stages easy to understand and modify”]
- **Goal 3:** [e.g. “Good for writing small algorithms and data structures”]

Influences:

- [C / Nim / Python / other PLs]
- Specific ideas you borrowed: [syntax, memory model, error handling, etc.]

---

## Language Overview (Brief)

Keep this section concise; link to a separate “language tour” post if you have one.

### Syntax at a Glance

```san
// Example San code
fn main() {
  let nums = [1][2][3][4][5]
  let sliced = nums[1:4]
  print(sliced)
}