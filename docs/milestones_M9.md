# Milestones

## M9 – Reusable form components and accessibility

**Status:** In progress

### Goal

Improve form consistency and accessibility by introducing reusable form components, clear validation messages, and automated accessibility tests.

### Completed

- Created the reusable `KField.vue` component.
- Added support for labels, hints, validation errors, and accessible descriptions.
- Added support for `v-model` and native input attributes.
- Integrated `KField` into the login, profile, and move form views.
- Added Storybook stories for the standard field, a field with help text, and a field with an error.
- Updated form validation and error handling in the move form.
- Added two accessibility tests for `KField`.
- Ran the following commands successfully in the local development environment:
  - `npm ci`
  - `npm run test:a11y`
  - `npm run test:run`
  - `npm run build`
  - `npm run build-storybook`

### In progress

- Expand `KField` accessibility coverage to include all four required tests.
- Add or complete accessibility tests for `MoveFormView`, including verification that the postal-code error is associated with its input.
- Verify the Storybook build and artifact upload in GitHub Actions.
- Confirm that the required CI status checks are configured correctly.

### Acceptance criteria

- [x] A reusable `KField` component is available.
- [x] The component supports labels, hints, and validation errors.
- [x] The component is integrated into the relevant form views.
- [x] Storybook stories are defined for the main field states.
- [ ] All four required `KField` accessibility tests are implemented and passing.
- [ ] The move form accessibility test is implemented and passing.
- [ ] GitHub Actions successfully runs the tests and builds the application.
- [ ] Storybook is built and uploaded as a CI artifact.
- [ ] Required status checks are configured and verified.

### Remaining work

1. Complete the missing accessibility tests.
2. Run the full test suite and all build commands.
3. Update the CI/CD workflow to build Storybook and upload the generated `storybook-static` directory.
4. Open or update a pull request and verify that all relevant GitHub Actions jobs pass.
5. Configure required status checks after confirming the actual workflow job names.
6. Update the project log with the final results and evidence.

### Definition of Done

M9 is complete when the reusable field component is integrated, all required accessibility tests pass, Storybook builds successfully in CI and is uploaded as an artifact, and the required GitHub status checks are verified.

---

## Documentation notes

Milestone status must reflect verified results. Local command success does not by itself confirm that GitHub Actions, artifact uploads, branch protection, or deployment workflows are working correctly.

### **Obs!** Just nu innehåller `src/components/KField.a11y.test.js` bara två tester. Jag låter dem vara tills vidare, så kan vi komplettera med de två återstående testerna senare.

Jag ska också uppdatera `docs/milestones.md` och `docs/log.md` så att de speglar det arbete som faktiskt har genomförts.
