// B2 · isolation du gate : au stade 3, tant que l'élève n'a pas cliqué,
// aucune section « avant-choix » (StepBar, critères, production) n'est rendue.
import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import MethodologyCompilerView from '../MethodologyCompilerView';

// jsdom ne fournit pas ResizeObserver (utilisé via framer-motion/recharts)
class RO { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver = globalThis.ResizeObserver ?? RO;
afterEach(() => cleanup());

const STEP_BAR_MARK = /الفعل يطلب الوصف/;      // ligne de justification §8 sous la StepBar (sous-texte)
const CRITERIA_MARK = /توجيه قبلي وتأكيد بالإثبات/; // sidebar critères stade 3
const GATE_MARK = 'المفتاح — هل الفعل يسمح بـ«لأنّ»؟';

const gotoStage3 = () => {
  fireEvent.click(screen.getAllByText('إنتاج موجه (Guidée)')[0]);
};

describe('B2 · isolation du gate au stade 3', () => {
  it("avant le clic : gate visible, ni StepBar ni critères ni zone d'écriture", () => {
    render(<MethodologyCompilerView />);
    gotoStage3();
    expect(screen.getByText(GATE_MARK)).toBeTruthy();
    expect(screen.queryByText(STEP_BAR_MARK)).toBeNull();
    expect(screen.queryByText(CRITERIA_MARK)).toBeNull();
    expect(screen.queryByPlaceholderText(/اكتب صياغتك/)).toBeNull();
  });

  it('après le clic « نعم — مفتوح » : gate fermé, sections rendues', () => {
    render(<MethodologyCompilerView />);
    gotoStage3();
    fireEvent.click(screen.getByText('نعم — مفتوح'));
    expect(screen.queryByText(GATE_MARK)).toBeNull();
    expect(screen.getByText(STEP_BAR_MARK)).toBeTruthy();
    expect(screen.getByText(CRITERIA_MARK)).toBeTruthy();
  });
});
