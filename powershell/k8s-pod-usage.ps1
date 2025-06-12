# Obter todos os pods
$pairs = @{}

$pods = kubectl get pods --all-namespaces -o json | ConvertFrom-Json

foreach ($pod in $pods.items) {
    $podName = $pod.metadata.name
    foreach ($container in $pod.spec.containers) {
        $resources = $container.resources

        $requests = $resources.requests
        $limits = $resources.limits

        $pairs[$podName] = [PSCustomObject]@{
            Pod         = $podName
            CPURequest  = $requests.cpu
            CPULimit    = $limits.cpu
            MemRequest  = $requests.memory
            MemLimit    = $limits.memory
        }
    }
}

# Obter uso atual com kubectl top
$topOutput = kubectl top pods --all-namespaces --no-headers

foreach ($line in $topOutput) {
    $parts = $line -split '\s+'
    $podName = $parts[0]
    $cpuUsed = $parts[1]
    $memUsed = $parts[2]

    if ($pairs.ContainsKey($podName)) {
        $pairs[$podName] | Add-Member -NotePropertyName CPUUsage -NotePropertyValue $cpuUsed
        $pairs[$podName] | Add-Member -NotePropertyName MemUsage -NotePropertyValue $memUsed
    }
}

# Mostrar tabela formatada
$pairs.Values | Sort-Object Pod | Format-Table Pod, CPURequest, CPUUsage, CPULimit, MemRequest, MemUsage, MemLimit -AutoSize
