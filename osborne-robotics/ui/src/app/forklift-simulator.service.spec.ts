import { TestBed } from '@angular/core/testing';
import { ForkliftSimulatorService } from './forklift-simulator.service';
import { CommandInstruction } from './forklift-simulator/forklift-simulator.component';

describe('ForkliftSimulatorService', () => {
  let service: ForkliftSimulatorService;

  // TODO: These tests have been added a starting point. The are based on the known
  // collision points and will need to be updated to become more stable.

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForkliftSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('executeCommand', () => {
    it('should move forward without collision', () => {
      const initial: CommandInstruction = {
        x: 0,
        y: 0,
        direction: 0,
        actions: [],
      };
      const result = service.executeCommand('F5', initial);

      expect(result.x).toBe(0);
      expect(result.y).toBe(5);
      expect(result.actions).toContain('Move Forward by 5 units.');
      expect(result.collisionMsg).toBeUndefined();
    });

    it('should detect collision with an obstacle', () => {
      const initial: CommandInstruction = {
        x: 2,
        y: 4,
        direction: 0,
        actions: [],
      };
      const result = service.executeCommand('F1', initial);

      expect(result.x).toBe(2);
      expect(result.y).toBe(5);
      expect(result.collisionMsg).toBe('Obstacle detected at 2, 5');
    });

    it('should move backward without collision', () => {
      const initial: CommandInstruction = {
        x: 5,
        y: 5,
        direction: 180,
        actions: [],
      };
      const result = service.executeCommand('B2', initial);

      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.actions).toContain('Move Backward by 2 units.');
    });

    it('should turn left', () => {
      const initial: CommandInstruction = {
        x: 0,
        y: 0,
        direction: 0,
        actions: [],
      };
      const result = service.executeCommand('L90', initial);

      expect(result.direction).toBe(270);
      expect(result.actions).toContain('Turn Left by 90 degrees.');
    });

    it('should turn right', () => {
      const initial: CommandInstruction = {
        x: 0,
        y: 0,
        direction: 0,
        actions: [],
      };
      const result = service.executeCommand('R180', initial);

      expect(result.direction).toBe(180);
      expect(result.actions).toContain('Turn Right by 180 degrees.');
    });
  });

  describe('moveForklift', () => {
    it('should clamp position within grid boundaries after moving forward', () => {
      const initial: CommandInstruction = {
        x: 11,
        y: 8,
        direction: 90,
        actions: [],
      };
      const result = service.executeCommand('F5', initial);

      expect(result.x).toBe(9); // Clamped at grid max width
      expect(result.y).toBe(8);
    });
  });
});
