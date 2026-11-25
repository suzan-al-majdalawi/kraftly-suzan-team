# M7 – Performance

## Measurement method

- Build: `npm run build`
- Server: `npm run preview`
- Tool: Chrome Lighthouse (local production preview)
- Browser: Google Chrome
- Page tested: `/login`
- Device profile: iPhone 12 Pro
- Viewport: 393 × 852
- Network: Fast 4G
- Cache: Disabled
- Runs: 3 per version
- Reported value: Median

## Before and after

| Optimization                | Before                           | After                              | PR / Reference                                                                                                              |
| --------------------------- | -------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Hero image optimization     | 8.46s production / 8.66s staging | 0.35s production / 0.71s staging   | [PR #21](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/21)                                                  |
| Lazy-loaded chart component | 1.2s LCP (main)                  | 0.9s LCP (M7-Snabb)                | [M7-Snabb branch](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/tree/M7%E2%80%93Snabb)                           |
| Debounced resize handling   | Not measured separately          | Implemented in `DashboardView.vue` | [Debounce commit](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/commit/65dc0d72ca4e0a4a547bdf5c92f42b49b1b0d1bd) |

**Note:** The Lighthouse values are median results from three local runs on each branch. They show the overall difference between `main` and `M7-Snabb`, not the isolated effect of each optimization. Debounce was implemented and build-verified, but its individual performance impact was not measured.

## Lighthouse results – median

| Metric                         | Before (main) | After (M7-Snabb) |
| ------------------------------ | ------------: | ---------------: |
| First Contentful Paint (FCP)   |          0.7s |             0.7s |
| Largest Contentful Paint (LCP) |          1.2s |             0.9s |
| Total Blocking Time (TBT)      |           0ms |              0ms |
| Cumulative Layout Shift (CLS)  |             0 |                0 |
| Speed Index                    |          1.0s |             0.8s |

## JavaScript bundle sizes

Build output from `npm run build`:

| JavaScript file        |      Size |     Gzip |
| ---------------------- | --------: | -------: |
| Main bundle (`index`)  | 111.63 kB | 43.84 kB |
| DashboardView chunk    |   3.64 kB |  1.87 kB |
| ConsumptionChart chunk | 207.94 kB | 71.49 kB |

The chart is emitted as a separate JavaScript chunk through `defineAsyncComponent`.

## Performance budget

| Metric          |                                         Limit | Result     |
| --------------- | --------------------------------------------: | ---------- |
| LCP             |                                        < 2.5s | Passed     |
| CLS             |                                         < 0.1 | Passed     |
| JavaScript gzip | Actual measured bundle sizes documented above | Documented |

## Conclusion

The Lighthouse measurements show an improvement in overall loading performance between `main` and `M7-Snabb`.

Median LCP improved from 1.2s to 0.9s, and Speed Index improved from 1.0s to 0.8s. CLS remained at 0 and TBT remained at 0ms.

The LCP and CLS budgets were met in the local Lighthouse tests. The chart component is loaded as a separate chunk, and debounced resize handling has been implemented. The individual performance impact of Debounce has not yet been measured.
