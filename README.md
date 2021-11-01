# A pace converter with reasonable UX.

See it at https://okkays.github.io/pace

## What does it do?

- Recognize and convert distances:
  - [x] mi, mile(s), M
  - [x] km, kilometer(s)
  - [x] ft, feet, foot
  - [x] m, meter(s)
  - Including specifiers:
    - [ ] quarter
    - [ ] half
    - [ ] full
  - Including named race distances:
    - [ ] marathon
    - [ ] century
- Recognize and convert durations:
  - [x] hour(s)
  - [x] minute(s)
  - [x] second(s)
  - [x] day(s)
  - [x] week(s)
  - [x] month(s)
- Recognize and convert paces of format:
  - [x] min/km, min per km
  - [x] mph
- Convert pace to formats of:
  - [x] min/km
  - [x] mph
- Convert efforts:
  - [ ] Find distance given pace and duration
  - [ ] Find duration given distance and pace
  - [ ] Find pace given distance and duration

It does these things in a user-friendly way, providing:

- [x] Type-ahead hints, with tab completion.
  - [x] When a number is typed, suggest singular/plural deviations
- [x] Live display of results.

## How to dev

Running tests:

```bash
ng test
```

Running a dev server (at http://localhost:4200):

```bash
ng serve
```

Deploying:

```bash
ng deploy
```
