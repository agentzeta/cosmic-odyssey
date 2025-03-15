
class WebGLEngine {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private assets: Map<string, any> = new Map();
  private entities: Entity[] = [];
  private systems: System[] = [];
  private lastFrameTime: number = 0;
  private isRunning: boolean = false;
  
  initialize(canvasId: string): boolean {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    
    if (!this.canvas) {
      console.error(`Canvas with id ${canvasId} not found`);
      return false;
    }
    
    this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext;
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return false;
    }
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    return true;
  }
  
  resize() {
    if (!this.canvas || !this.gl) return;
    
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;
    
    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  stop() {
    this.isRunning = false;
  }
  
  reset() {
    this.entities = [];
    this.systems = [];
    this.lastFrameTime = 0;
  }
  
  addEntity(entity: Entity) {
    this.entities.push(entity);
    return entity;
  }
  
  addSystem(system: System) {
    this.systems.push(system);
    
    if (system.initialize && this.gl) {
      system.initialize(this.gl);
    }
    
    return system;
  }
  
  private gameLoop(timestamp: number) {
    if (!this.isRunning) return;
    
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Update all systems
    for (const system of this.systems) {
      system.update(deltaTime / 1000, this.entities);
    }
    
    // Render
    if (this.gl) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      
      // Render all systems
      for (const system of this.systems) {
        if (system.render) {
          system.render(this.gl, this.entities);
        }
      }
    }
    
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  async loadAsset(name: string, url: string, type: 'texture' | 'sound' | 'model' | 'shader'): Promise<any> {
    try {
      let asset;
      
      switch (type) {
        case 'texture':
          asset = await this.loadTexture(url);
          break;
        case 'sound':
          asset = await this.loadSound(url);
          break;
        case 'model':
          asset = await this.loadModel(url);
          break;
        case 'shader':
          asset = await this.loadShader(url);
          break;
        default:
          throw new Error(`Unsupported asset type: ${type}`);
      }
      
      this.assets.set(name, asset);
      return asset;
    } catch (error) {
      console.error(`Error loading asset ${name} from ${url}:`, error);
      throw error;
    }
  }
  
  getAsset(name: string): any {
    return this.assets.get(name);
  }
  
  private async loadTexture(url: string): Promise<WebGLTexture> {
    return new Promise((resolve, reject) => {
      if (!this.gl) {
        reject(new Error('WebGL context not initialized'));
        return;