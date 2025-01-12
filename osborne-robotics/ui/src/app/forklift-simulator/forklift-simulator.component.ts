import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForkliftSimulatorService } from '../forklift-simulator.service';
import { WarehouseGridCell } from '../model/warehouse-grid-cell';

export interface CommandInstruction {
  x: number;
  y: number;
  direction: number;
  actions: string[];
  collisionMsg?: string;
}

@Component({
  selector: 'app-forklift-simulator',
  imports: [NgForOf, NgClass, FormsModule, NgIf],
  templateUrl: './forklift-simulator.component.html',
  styleUrl: './forklift-simulator.component.css',
  standalone: true,
})
export class ForkliftSimulatorComponent implements OnInit {
  private static readonly GRID_SIZE = 10;
  private static readonly CELL_SIZE = 50;
  private static readonly COMMAND_PROCESS_ERROR =
    'Command could not be processed. Please ensure that you have entered a valid command.';

  private static readonly DIRECTION_NAMES: Record<number, string> = {
    0: 'North',
    90: 'East',
    180: 'South',
    270: 'West',
  };

  // TODO: For the 10x10 grid, although the bottom left corner is (x0, y0), that cell is the 90th
  // cell that is rendered. For the gris to be dynamic, this must be improved.
  private static readonly DEFAULT_FORKLIFT_RENDER_INDEX = 90;

  showInstructions = false;

  crossIndex = 42;
  crossIndex2 = 19;
  forkliftRenderIndex =
    ForkliftSimulatorComponent.DEFAULT_FORKLIFT_RENDER_INDEX;
  warehouseGridCells: WarehouseGridCell[] = Array.from({ length: 100 });
  forkliftTransform = 'translate(0px, 0px)';
  commandInstruction = this.initCommandInstruction();
  command = '';
  errorMsg: string = '';

  constructor(private forkliftService: ForkliftSimulatorService) {}

  getGridPosition(cmd: CommandInstruction): number {
    const size = ForkliftSimulatorComponent.GRID_SIZE;

    if (cmd.x < 0 || cmd.y < 0 || cmd.x >= size || cmd.y >= size) {
      throw new Error('x or y is out of bounds.');
    }

    return (size - cmd.y - 1) * size + cmd.x;
  }

  runCommand(command: string | undefined) {
    if (!command) return;

    this.errorMsg = '';
    this.commandInstruction = this.forkliftService.executeCommand(
      command,
      this.commandInstruction,
    );

    if (this.canProcessCommand()) {
      this.updateForkliftPosition(this.commandInstruction);
      this.forkliftRenderIndex = this.getGridPosition(this.commandInstruction);
    } else {
      this.errorMsg =
        this.commandInstruction.collisionMsg ||
        ForkliftSimulatorComponent.COMMAND_PROCESS_ERROR;
    }
  }

  getDirectionName(instruction: CommandInstruction): string {
    return (
      ForkliftSimulatorComponent.DIRECTION_NAMES[instruction?.direction] ||
      'Unknown'
    );
  }

  private updateForkliftPosition(cmdResponse: CommandInstruction): void {
    const pixelX = cmdResponse.x * ForkliftSimulatorComponent.CELL_SIZE;
    const pixelY =
      (ForkliftSimulatorComponent.GRID_SIZE - 1 - cmdResponse.y) *
      ForkliftSimulatorComponent.CELL_SIZE;
    const rotation = cmdResponse.direction % 360;

    this.forkliftTransform = `translate(${pixelX}px, ${pixelY}px) rotate(${rotation}deg)`;
  }

  resetCommand() {
    this.command = '';
    this.errorMsg = '';
    this.commandInstruction = this.initCommandInstruction();
    this.forkliftRenderIndex =
      ForkliftSimulatorComponent.DEFAULT_FORKLIFT_RENDER_INDEX;

    this.updateForkliftPosition(this.commandInstruction);
  }

  private initCommandInstruction(): CommandInstruction {
    return {
      x: 0,
      y: 0,
      direction: 0,
      actions: [],
    };
  }

  ngOnInit(): void {
    this.updateForkliftPosition(this.commandInstruction);
  }

  actionsCanBeDisplayed(): boolean {
    return (
      !this.errorMsg &&
      !!this.commandInstruction?.actions &&
      this.commandInstruction.actions.length > 0
    );
  }

  private canProcessCommand(): boolean {
    return (
      this.commandInstruction.actions.length > 0 &&
      !this.commandInstruction.collisionMsg
    );
  }

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }
}
