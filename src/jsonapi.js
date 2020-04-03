import { Resource } from './resource'

export class JsonApi {
  constructor(jsonapi) {
    this.jsonapi = JSON.parse(jsonapi);
  }

  getData() {
    const { data, included } = this.jsonapi;

    if (Array.isArray(data)) {
      return data.map(el => new Resource(el, included));
    }

    return new Resource(data, included);
  }
}
