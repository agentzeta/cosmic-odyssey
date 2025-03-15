
class XTracer {
  private spans: Map<string, Span>;
  private activeSpans: string[];
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.spans = new Map();
    this.activeSpans = [];
    this.apiKey = process.env.REACT_APP_XTRACE_API_KEY || '';
    this.baseUrl = 'https://api.xtrace.io/v1';
  }
  
  startSpan(name: string, tags: Record<string, any> = {}) {
    const spanId = `span_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const parentId = this.activeSpans.length > 0 ? this.activeSpans[this.activeSpans.length - 1] : undefined;
    
    const span = new Span(spanId, name, tags, parentId);
    this.spans.set(spanId, span);
    this.activeSpans.push(spanId);
    
    return spanId;
  }
  
  endSpan(spanId?: string) {
    const targetSpanId = spanId || this.activeSpans[this.activeSpans.length - 1];
    
    if (!targetSpanId) {
      console.warn('No active span to end');
      return;
    }
    
    const span = this.spans.get(targetSpanId);
    
    if (span) {
      span.end();
      
      // Remove from active spans
      const index = this.activeSpans.indexOf(targetSpanId);
      if (index !== -1) {
        this.activeSpans.splice(index, 1);
      }
      
      // For demo purposes, we'll just log the span
      console.log(`Ended span: ${span.name}`, span.toJSON());
    }
  }
  
  addEvent(spanId: string, name: string, attributes: Record<string, any> = {}) {
    const span = this.spans.get(spanId);
    
    if (span) {
      span.addEvent(name, attributes);
    } else {
      console.warn(`Span with ID ${spanId} not found`);
    }
  }
  
  setTag(spanId: string, key: string, value: any) {
    const span = this.spans.get(spanId);
    
    if (span) {
      span.setTag(key, value);
    } else {
      console.warn(`Span with ID ${spanId} not found`);
    }
  }
  
  async exportTraces() {
    // For demo purposes, we'll just log the spans
    console.log('Exporting traces', Array.from(this.spans.values()).map(span => span.toJSON()));
  }
}

class Span {
  id: string;
  name: string;
  tags: Record<string, any>;
  parentId?: string;
  startTime: number;
  endTime?: number;
  events: Array<{
    name: string;
    timestamp: number;
    attributes: Record<string, any>;
  }>;
  
  constructor(id: string, name: string, tags: Record<string, any> = {}, parentId?: string) {
    this.id = id;
    this.name = name;
    this.tags = { ...tags };
    this.parentId = parentId;
    this.startTime = Date.now();
    this.events = [];
  }
  
  end() {
    this.endTime = Date.now();
  }
  
  addEvent(name: string, attributes: Record<string, any> = {}) {
    this.events.push({
      name,
      timestamp: Date.now(),
      attributes
    });
  }
  
  setTag(key: string, value: any) {
    this.tags[key] = value;
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tags: this.tags,
      parentId: this.parentId,
      startTime: this.startTime,
      endTime: this.endTime,
      events: this.events,
      duration: this.endTime ? this.endTime - this.startTime : undefined
    };
  }
}

export const xTracer = new XTracer();
EOF