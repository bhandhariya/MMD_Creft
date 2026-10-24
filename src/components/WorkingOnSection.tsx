import React from 'react';
import workshopData from '../data/workshop.json';
import { Cpu, Activity, Gauge, CheckCircle2, Flame, Wrench, Shield } from 'lucide-react';

export const WorkingOnSection: React.FC = () => {
  return (
    <section id="working-on" className="py-20 relative bg-[#04060b] border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>LIVE WORKSHOP TELEMETRY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
              Working On: Live Fabrication Queue
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Inspect active fabrication runs currently traversing our optical laser beds and 5-axis CNC machining centers. Full operational transparency from raw sheet loading to diamond edge polish.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ALL 10 CUTTING BEDS OPERATIONAL</span>
          </div>
        </div>

        {/* Factory Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 block">DAILY CUTTING CAPACITY</span>
            <span className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1 block">
              {workshopData.factoryStats.dailyCuttingCapacity}
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Continuous 3-shift uptime</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 block">POSITIONAL ACCURACY</span>
            <span className="text-2xl font-bold font-['Space_Grotesk'] text-cyan-300 mt-1 block">
              {workshopData.factoryStats.positionalAccuracy}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Optical encoder servo drive</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 block">ACTIVE LASER BEDS</span>
            <span className="text-2xl font-bold font-['Space_Grotesk'] text-amber-400 mt-1 block">
              {workshopData.factoryStats.activeLaserBeds} Systems (130-150W)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Coaxial nitrogen assist</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 block">DISPATCH SPEED</span>
            <span className="text-2xl font-bold font-['Space_Grotesk'] text-emerald-400 mt-1 block">
              {workshopData.factoryStats.averageDispatchTime}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Express air courier logistics</span>
          </div>
        </div>

        {/* Live Jobs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workshopData.liveJobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-colors relative overflow-hidden"
            >
              {/* Top Job Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{job.id}</span>
                  <span className="text-slate-600 font-mono">/</span>
                  <span className="text-xs font-mono text-slate-400">{job.machine}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {job.batchSize}
                </span>
              </div>

              {/* Job Title & Substrate */}
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                {job.jobName}
              </h3>
              <p className="text-xs font-mono text-amber-400/90 mt-1">
                Substrate: {job.material}
              </p>

              {/* Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{job.status}</span>
                  <span className="text-cyan-400 font-bold">{job.progress}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>

              {/* Machine Telemetry Specs */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">FEED SPEED</span>
                  <span className="text-slate-300 font-semibold">{job.feedRate}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">POWER / RPM</span>
                  <span className="text-cyan-300 font-semibold">{job.laserPower}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">LEAD TECH</span>
                  <span className="text-slate-300 font-semibold">{job.operator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
