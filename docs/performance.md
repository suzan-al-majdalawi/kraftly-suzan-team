# M7 – Performance

## Measurement method

- Build: npm run build
- Server: npm run preview
- Browser: Chrome DevTools Performance
- Device: iPhone 12 Pro
- Viewport: 393 × 852
- Network: Fast 4G
- Cache: Disabled
- Runs: 3 per version
- Reported value: Median

## Before and after

| Optimization            | Before                     | After                      | PR                                                                 |
| ----------------------- | -------------------------- | -------------------------- | ------------------------------------------------------------------ |
| Hero image optimization | 8.46s prod - 8.66s staging | 0.35s prod - 0.71s staging | [https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/21] |
| Lazy-loaded routes      | TODO                       | TODO                       | säknas plats                                                       |
| Third optimization      | TODO                       | TODO                       | säknas plats                                                       |

## Budget

| Metric          | Limit                               |
| --------------- | ----------------------------------- |
| LCP             | < 2.5 s                             |
| CLS             | < 0.1                               |
| JavaScript gzip | Actual measured size + small margin |
