import { normalizeHonorificValue } from '../v3/honorificTerminology';
import type { V3CaseId } from '../v3/types';
import { v4CaseExperience } from './actionSimulationConfig';
import { v4InstructorGuides, v4PlaybookModel } from './instructorGuideConfig';

export function applySupportingHonorificTerminology() {
  const normalizedExperience = normalizeHonorificValue(v4CaseExperience);
  (Object.keys(normalizedExperience) as V3CaseId[]).forEach((id) => {
    Object.assign(v4CaseExperience[id], normalizedExperience[id]);
  });

  const normalizedGuides = normalizeHonorificValue(v4InstructorGuides);
  (Object.keys(normalizedGuides) as V3CaseId[]).forEach((id) => {
    Object.assign(v4InstructorGuides[id], normalizedGuides[id]);
  });

  Object.assign(v4PlaybookModel, normalizeHonorificValue(v4PlaybookModel));
}
