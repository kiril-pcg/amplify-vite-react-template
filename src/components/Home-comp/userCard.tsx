import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface UserCardProps {
  user: any;
  isSelected: boolean;
  onSelect: () => void;
}

export function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSeeMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  return (
    <Card 
      className={`w-full h-full flex flex-col cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-lg' : 'hover:shadow-md'
      }`} 
    >
      <CardHeader className="flex flex-row items-center gap-4" onClick={onSelect}>
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.profile_picture_url} alt={`${user.first_name} ${user.last_name}`} />
          <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.first_name} {user.last_name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.headline}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow" onClick={onSelect}>
        <div className="space-y-2">
          <p><strong>Company:</strong> {user.work_experience[0]?.company || 'N/A'}</p>
          <p><strong>Position:</strong> {user.work_experience[0]?.position || 'N/A'}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p className="text-sm text-muted-foreground line-clamp-3">{user.summary}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" onClick={handleSeeMoreClick}>
              See more
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.profile_picture_url} alt={`${user.first_name} ${user.last_name}`} />
                <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
              </Avatar>
              <DialogTitle>{user.first_name} {user.last_name}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold">About</h3>
                  <p>{user.summary}</p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  {user.work_experience.map((exp: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p><strong>{exp.position}</strong> at {exp.company}</p>
                      <p>{exp.start} - {exp.end || 'Present'}</p>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                  ))}
                </section>
                <section>
                  <h3 className="text-lg font-semibold">Education</h3>
                  {user.education.map((edu: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p><strong>{edu.school}</strong></p>
                      <p>{edu.degree}</p>
                      {edu.start && edu.end && <p>{edu.start} - {edu.end}</p>}
                    </div>
                  ))}
                </section>
                <section>
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: any, index: number) => (
                      <Badge key={index} variant="secondary">{skill.name}</Badge>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-semibold">Certifications</h3>
                  {user.certifications.map((cert: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p><strong>{cert.name}</strong></p>
                      <p>{cert.organization}</p>
                    </div>
                  ))}
                </section>
                {user.birthdate && (
                  <section>
                    <h3 className="text-lg font-semibold">Birthday</h3>
                    <p>{user.birthdate.month}/{user.birthdate.day}</p>
                  </section>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}