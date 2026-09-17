import {describe,expect,it} from 'vitest';
import {events} from './domain';
import {auditBuild,inspectPortfolio,rankCandidates} from './coreEngine';

describe('Core Engine',()=>{
  it('ranks open candidates by value and portfolio overlap',()=>{
    const candidates=rankCandidates(events,[]);
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.every(c=>c.selection.status==='open')).toBe(true);
    expect(candidates[0].impliedProbability).toBeGreaterThan(0);
  });

  it('detects structural correlation inside one event',()=>{
    const first=events[0].markets[0].selections[0];
    const second=events[0].markets[1].selections[0];
    const portfolio=inspectPortfolio(events,[first,second]);
    expect(portfolio.correlationRisk).toBeGreaterThan(0);
    expect(portfolio.diversification).toBeLessThan(1);
  });

  it('returns an auditable decision packet',()=>{
    const selections=[events[0].markets[0].selections[0],events[1].markets[0].selections[0]];
    const audit=auditBuild(events,events[0],selections,'optimize');
    expect(['REVIEW','CAUTION','BLOCKED']).toContain(audit.decision);
    expect(audit.legAudits).toHaveLength(2);
    expect(audit.decisionReasons.length).toBeGreaterThan(0);
  });
});
