import { Injectable } from '@angular/core';
import { CommandInstruction } from './forklift-simulator/forklift-simulator.component';
import { WarehouseGridCell } from './model/warehouse-grid-cell';

@Injectable({
  providedIn: 'root',
})
export class ForkliftSimulatorService {
  // TODO: Fix bug which allows the forklift jump over the obstacles.
  // TODO: Fix bug which displays actions which have exceeded the grid boundaries.
  // TODO: For now, the obstacles are hardcoded. Make them dynamic or configurable.
  private readonly obstacles: WarehouseGridCell[] = [
    { x: 2, y: 5 },
    { x: 9, y: 8 },
  ];

  private readonly warehouseGridBoundaries = { min: 0, max: 9 };

  private static readonly FORWARD = 'F';
  private static readonly BACKWARD = 'B';
  private static readonly LEFT = 'L';
  private static readonly RIGHT = 'R';

  private static readonly DIRECTION_UP = 0;
  private static readonly DIRECTION_RIGHT = 90;
  private static readonly DIRECTION_DOWN = 180;
  private static readonly DIRECTION_LEFT = 270;

  executeCommand(
    command: string,
    current: CommandInstruction,
  ): CommandInstruction {
    const cmdResponse: CommandInstruction = { ...current, actions: [] };

    const commands = command.match(/[A-Z][0-9]+/g) || [];

    commands.forEach((cmd) => {
      const action = cmd[0];
      const value = parseInt(cmd.slice(1), 10);

      switch (action) {
        case ForkliftSimulatorService.FORWARD:
          this.moveForklift(value, cmdResponse, 'Forward');
          break;
        case ForkliftSimulatorService.BACKWARD:
          this.moveForklift(-value, cmdResponse, 'Backward');
          break;
        case ForkliftSimulatorService.LEFT:
          this.turnForklift(-value, cmdResponse, 'Left');
          break;
        case ForkliftSimulatorService.RIGHT:
          this.turnForklift(value, cmdResponse, 'Right');
          break;
        default:
          console.warn(`Unknown command: ${cmd}`);
      }
    });

    return cmdResponse;
  }

  private moveForklift(
    distance: number,
    instruction: CommandInstruction,
    action: string,
  ): void {
    switch (instruction.direction) {
      case ForkliftSimulatorService.DIRECTION_UP:
        instruction.y += distance;
        break;
      case ForkliftSimulatorService.DIRECTION_RIGHT:
        instruction.x += distance;
        break;
      case ForkliftSimulatorService.DIRECTION_DOWN:
        instruction.y -= distance;
        break;
      case ForkliftSimulatorService.DIRECTION_LEFT:
        instruction.x -= distance;
        break;
      default:
        console.warn(`Unknown direction: ${instruction.direction}`);
    }

    if (this.collisionHasBeenDetected(instruction.x, instruction.y)) {
      instruction.collisionMsg = `Obstacle detected at ${instruction.x}, ${instruction.y}`;
      return;
    }

    instruction.x = this.clampGridBoundary(instruction.x);
    instruction.y = this.clampGridBoundary(instruction.y);

    instruction.actions.push(`Move ${action} by ${Math.abs(distance)} units.`);
  }

  private turnForklift(
    degrees: number,
    cmdResponse: CommandInstruction,
    action: string,
  ): void {
    cmdResponse.direction = (cmdResponse.direction + degrees + 360) % 360;
    cmdResponse.actions.push(`Turn ${action} by ${Math.abs(degrees)} degrees.`);
  }

  private collisionHasBeenDetected(x: number, y: number): boolean {
    return this.obstacles.some(
      (obstacle) => obstacle.x === x && obstacle.y === y,
    );
  }

  private clampGridBoundary(value: number): number {
    return Math.max(
      this.warehouseGridBoundaries.min,
      Math.min(this.warehouseGridBoundaries.max, value),
    );
  }
}
