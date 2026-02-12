import { useState } from 'react';
import { GitBranch, Eye, Brain, Zap, Rocket, Star, Lock, Play, ShoppingCart, Users, ChevronRight } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Skill } from '@/types';

// Skill branch colors
const branchConfig = {
  perception: { color: 'text-emerald-400', bgColor: 'bg-emerald-500', icon: Eye, label: '感知' },
  reasoning: { color: 'text-cyan-400', bgColor: 'bg-cyan-500', icon: Brain, label: '推理' },
  action: { color: 'text-amber-400', bgColor: 'bg-amber-500', icon: Zap, label: '行动' },
  evolution: { color: 'text-purple-400', bgColor: 'bg-purple-500', icon: Rocket, label: '进化' },
};

// Skill Node Component
function SkillNodeComponent({ 
  skill, 
  isSelected, 
  onClick 
}: { 
  skill: Skill; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const config = branchConfig[skill.branch];
  const Icon = config.icon;
  const isMaxed = skill.level === skill.maxLevel;
  const isUnlocking = skill.isUnlocking;

  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-xl border transition-all duration-300 text-left
        ${isSelected 
          ? `border-${config.bgColor.replace('bg-', '')} bg-zinc-800` 
          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
        }
        ${isUnlocking ? 'animate-pulse' : ''}
      `}
    >
      {/* Level badge */}
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{skill.level}</span>
      </div>

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${config.bgColor}/20 flex items-center justify-center mb-2`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Name */}
      <h4 className="text-xs font-medium text-white mb-1 line-clamp-1">{skill.name}</h4>

      {/* Proficiency bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${config.bgColor}`}
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
        <span className="text-[10px] text-zinc-400">{skill.proficiency}%</span>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-1 mt-2">
        {isMaxed && <Star className="w-3 h-3 text-amber-400" />}
        {isUnlocking && <Lock className="w-3 h-3 text-purple-400" />}
      </div>
    </button>
  );
}

// Skill Detail Card
function SkillDetailCard({ skill }: { skill: Skill }) {
  const config = branchConfig[skill.branch];
  const Icon = config.icon;

  return (
    <Card className="p-5 bg-[#1a1a24] border-zinc-800">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl ${config.bgColor}/20 flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-zinc-400">
              等级：Lv.{skill.level}/{skill.maxLevel}
            </span>
            <span className="text-xs text-zinc-500">|</span>
            <span className="text-xs text-zinc-400">
              熟练度：{skill.proficiency}%
            </span>
          </div>
        </div>
      </div>

      {/* Proficiency progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-zinc-500">熟练度</span>
          <span className={`${config.color} font-mono-data`}>{skill.proficiency}%</span>
        </div>
        <Progress value={skill.proficiency} className="h-2" />
      </div>

      {/* Effects */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">当前效果</h4>
        <ul className="space-y-1">
          {skill.effects.map((effect, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
              <ChevronRight className={`w-3 h-3 ${config.color}`} />
              {effect}
            </li>
          ))}
        </ul>
      </div>

      {/* Next unlocks */}
      {skill.nextUnlocks && skill.nextUnlocks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-zinc-400 mb-2">
            下一级（Lv.{skill.level + 1}）解锁
          </h4>
          <ul className="space-y-1">
            {skill.nextUnlocks.map((unlock, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-cyan-400">
                <Lock className="w-3 h-3" />
                {unlock}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {skill.requirements && (
        <div className="mb-4 p-3 rounded-lg bg-zinc-800/50">
          <h4 className="text-xs font-medium text-zinc-400 mb-1">升级需求</h4>
          <p className="text-xs text-zinc-500">{skill.requirements}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button className={`flex-1 ${config.bgColor} hover:opacity-90 text-black`}>
          <Play className="w-4 h-4 mr-1" />
          开始训练
        </Button>
        <Button variant="outline" className="border-zinc-700">
          <ShoppingCart className="w-4 h-4 mr-1" />
          购买加速
        </Button>
        <Button variant="outline" className="border-zinc-700">
          <Users className="w-4 h-4 mr-1" />
          查看策略
        </Button>
      </div>
    </Card>
  );
}

// Skill Branch Section
function SkillBranchSection({ 
  branch, 
  skills, 
  selectedSkill, 
  onSelectSkill 
}: { 
  branch: Skill['branch'];
  skills: Skill[];
  selectedSkill: string | null;
  onSelectSkill: (id: string) => void;
}) {
  const config = branchConfig[branch];
  const Icon = config.icon;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-lg ${config.bgColor}/20 flex items-center justify-center`}>
          <Icon className={`w-3 h-3 ${config.color}`} />
        </div>
        <h3 className={`text-sm font-semibold ${config.color}`}>{config.label}分支</h3>
        <span className="text-xs text-zinc-500">({skills.length} 技能)</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {skills.map((skill) => (
          <SkillNodeComponent
            key={skill.id}
            skill={skill}
            isSelected={selectedSkill === skill.id}
            onClick={() => onSelectSkill(skill.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Main Component
export function SkillTree() {
  const { skills } = useDashboard();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(skills[0]?.id || null);

  const selectedSkill = skills.find(s => s.id === selectedSkillId);

  const skillsByBranch = {
    perception: skills.filter(s => s.branch === 'perception'),
    reasoning: skills.filter(s => s.branch === 'reasoning'),
    action: skills.filter(s => s.branch === 'action'),
    evolution: skills.filter(s => s.branch === 'evolution'),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">技能树</h2>
          <p className="text-sm text-zinc-500">能力组合与进化路径</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Star className="w-4 h-4 text-amber-400" />
            <span>已解锁：{skills.filter(s => s.level > 0).length}/{skills.length}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>进化中：{skills.filter(s => s.isUnlocking).length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Skill Tree */}
        <div className="col-span-7">
          <Card className="h-full p-5 bg-[#1a1a24] border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              技能图谱
            </h3>
            
            {(Object.keys(skillsByBranch) as Array<keyof typeof skillsByBranch>).map((branch) => (
              <SkillBranchSection
                key={branch}
                branch={branch}
                skills={skillsByBranch[branch]}
                selectedSkill={selectedSkillId}
                onSelectSkill={setSelectedSkillId}
              />
            ))}
          </Card>
        </div>

        {/* Skill Detail */}
        <div className="col-span-5">
          {selectedSkill ? (
            <SkillDetailCard skill={selectedSkill} />
          ) : (
            <Card className="h-full p-5 bg-[#1a1a24] border-zinc-800 flex items-center justify-center">
              <div className="text-center text-zinc-500">
                <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>选择一个技能查看详情</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
