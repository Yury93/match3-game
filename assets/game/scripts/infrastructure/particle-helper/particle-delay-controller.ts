const { ccclass, property } = cc._decorator;

@ccclass
export class ParticleDelayController extends cc.Component {
  @property([cc.ParticleSystem])
  particleSystem: cc.ParticleSystem[] = [];

  @property([cc.Float])
  delay: number[] = [];

  start() {
    this.startParticlesWithDelays();
  }

  startParticlesWithDelays() {
    for (let i = 0; i < this.particleSystem.length; i++) {
      const ps = this.particleSystem[i];
      const delay = this.delay[i];

      if (ps && ps.isValid && delay !== undefined) {
        this.scheduleOnce(() => {
          this.startSingleParticle(ps);
        }, delay);
      } else {
        cc.log(`Skipping particle ${i}: invalid configuration`);
      }
    }
  }

  startSingleParticle(particleSystem: cc.ParticleSystem) {
    // Двойная проверка на существование
    if (particleSystem && particleSystem.isValid) {
      particleSystem.node.active = true;
      particleSystem.resetSystem();
    } else {
      cc.log("Attempted to start an invalid particle system");
    }
  }

  // Метод для немедленного запуска всех частиц
  startAllParticlesNow() {
    for (let i = 0; i < this.particleSystem.length; i++) {
      const ps = this.particleSystem[i];
      this.startSingleParticle(ps);
    }
  }

  // Метод для остановки всех частиц
  stopAllParticlesNow() {
    this.unscheduleAllCallbacks();
    // this.stopAllParticles();
  }
}
