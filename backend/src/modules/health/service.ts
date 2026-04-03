export abstract class HealthService {
  static status() {
    return {
      ok: true,
      service: 'backend',
    }
  }
}
